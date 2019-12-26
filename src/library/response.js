const response = (res, status, message, data) => {
    res.status(status)
        .json({
            'status': status,
            'message': message,
            'data': data
        });
};

const errResponse = (res, status, message) => {
    res.status(status)
        .json({
            'status': status,
            'message': message
        });
}

module.exports = {
    response,
    errResponse
}