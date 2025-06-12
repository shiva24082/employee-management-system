const Employee = require('../models/Employee');
const ErrorResponse = require('../utils/errorResponse');

exports.getEmployees = async (req, res, next) => {
  try {
    const { department, position, status, search } = req.query;
    
    const query = {};
    
    if (department) query.department = department;
    if (position) query.position = { $regex: position, $options: 'i' };
    if (status) query.status = status;
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const employees = await Employee.find(query)
      .populate('manager', 'firstName lastName')
      .sort({ lastName: 1 });
    
    res.status(200).json({ 
      success: true, 
      count: employees.length, 
      data: employees 
    });
  } catch (err) {
    next(err);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('manager', 'firstName lastName');

    if (!employee) {
      return next(new ErrorResponse(`Employee not found with id ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

exports.createEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      data: employee 
    });
  } catch (err) {
    next(err);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    let employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return next(new ErrorResponse(`Employee not found with id ${req.params.id}`, 404));
    }

    employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('manager', 'firstName lastName');

    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return next(new ErrorResponse(`Employee not found with id ${req.params.id}`, 404));
    }

    await Employee.deleteOne({ _id: req.params.id });

    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (err) {
    next(err);
  }
};