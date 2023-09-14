const getDependencies = async () => {
  let common;

  if (process.env.NODE_ENV == "test") {
    common = await import("../layer/common.mjs");
  } else {
    common = await import("/opt/common.mjs");
  }

  return {
    CognitoController: common.CognitoController,
    corsDefaultHeaders: common.corsDefaultHeaders,
  };
};

export const AuthLambdaHandler = async (event, context) => {
  try {
    const { CognitoController, corsDefaultHeaders } = await getDependencies();
    const { path, body } = event;
    const { password, phone_number } = JSON.parse(body);

    const cognitoController = new CognitoController();

    let apiServiceResult,
      result = {},
      statusCode = 200;
    try {
      switch (path) {
        case "/signup":
          apiServiceResult = await cognitoController.signUpUser(
            phone_number,
            password
          );
          break;
        case "/signin":
          apiServiceResult = await cognitoController.signInUser(phone_number);
          break;
        default:
          apiServiceResult = {
            status: false,
            data: { message: "API not exists" },
          };
          break;
      }
      if (!apiServiceResult.status) {
        statusCode = 400;
      }
      result = { ...apiServiceResult.data, status: apiServiceResult.status };
      return {
        statusCode,
        headers: { ...corsDefaultHeaders },
        body: JSON.stringify(result),
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers: { ...corsDefaultHeaders },
        body: JSON.stringify({
          message: error?.message ? error.message : error.toString(),
        }),
      };
    }
  } catch (error) {
    console.log("lambda Catch err");
    console.log(error);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({
        message: error.message ? error.message : error.toString(),
      }),
    };
  }
};
