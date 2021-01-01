import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import API from '../utils/api.js';

// Maybe check type?

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(`No document exists with ${req.params.id}`, 404)
      );
    }

    res.status(204).json({
      status: 'Deleted',
      data: {
        tour: null,
      },
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;

    //const { review, rating, tour } = req.body; // sterilization
    const doc = await Model.findByIdAndUpdate(
      id,
      req.body, // sterilization ??
      { new: true, runValidators: true }
    );

    if (!doc)
      return next(
        new AppError(`The document with ${id} could not be fount.`, 400)
      );

    res.status(201).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });

const getOne = (Model, popOption) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);

    if (popOption) query = query.populate(popOption);
    const doc = await query;

    if (!doc)
      return next(
        new AppError(`The document with ${id} could not be fount.`, 400)
      );

    res.status(200).json({
      status: 'Success',
      data: {
        doc,
      },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body); //TODO: data serialization
    res.status(201).json({
      data: {
        newDoc,
      },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res) => {
    const filter = req.params.id ? { tour: req.params.id } : {}; // one tour or all

    const api = new API(Model.find(filter), req.query) // Hack with filter
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await api.query; //.explain();

    res.status(200).json({
      status: 'Success',
      requests: doc.length,
      data: {
        doc,
      },
    });
  });

  export default {deleteOne, updateOne, getOne, createOne, getAll}