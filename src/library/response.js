const response = (res, status, message, data) => {
    res.status(200)
        .json({
            'status': status,
            'message': message,
            'data': data
        });
};

const errResponse = (res, status, message) => {
    res.status(200)
        .json({
            'status': status,
            'message': message
        });
}

module.exports = {
    response,
    errResponse
}