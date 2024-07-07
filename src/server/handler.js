const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const { storeData, getHistories } = require('../services/Firestore');

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  const { label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    "id": id,
    "result": label,
    "suggestion": suggestion,
    "createdAt": createdAt
  }

  await storeData(id, data);

  const response = h.response({
    status: 'success',
    message: 'Model is predicted successfully',
    data
  })
  response.code(201);
  return response;
}

async function getHistoriesHandler(request, h) {
  try {
    const histories = await getHistories();
    
    const response = h.response({
      status: 'success',
      data: histories
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Failed to retrieve histories',
      error: error.message
    });
    response.code(500);
    return response;
  }
}

module.exports = { postPredictHandler, getHistoriesHandler };
