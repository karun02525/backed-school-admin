class CustomErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.msg = msg;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }

  static alreadyDeleted(message) {
    return new CustomErrorHandler(404, message);
  }
  static invalidInput(message) {
    return new CustomErrorHandler(400, message);
  }

  static serverError(message='Internal server error') {
    return new CustomErrorHandler(500, message);
  }
}

export default CustomErrorHandler;
