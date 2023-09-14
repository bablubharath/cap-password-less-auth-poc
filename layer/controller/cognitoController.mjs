import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIA6FMCIIJV2M5A7NRD",
  secretAccessKey: "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",
});

class CognitoController {
  cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
  });

  signUpUser = async (phoneNumber, password) => {
    console.log("Entered");
    const signUpParams = {
      ClientId: "n4p4i5mfkuro0kd1es3aupmjp",
      Username: phoneNumber,
      Password: password,
      UserAttributes: [
        {
          Name: "phone_number",
          Value: phoneNumber,
        },
      ],
    };

    let signUpResponse;
    try {
      signUpResponse = await this.cognitoIdentityServiceProvider
        .signUp(signUpParams)
        .promise();
    } catch (error) {
      console.log("signUpResponse Catch err");
      console.log(error);
      return {
        status: false,
        data: {
          message: error?.message ? error.message : error.toString(),
          errorType: "sign_up_error",
        },
      };
    }

    return signUpResponse;
  };

  signInUser = async (mobileNumber) => {
    const signInParams = {
      AuthFlow: "CUSTOM_AUTH",
      ClientId: "n4p4i5mfkuro0kd1es3aupmjp",
      UserPoolId: "us-east-1_BX3K4WE2a",
      AuthParameters: {
        USERNAME: mobileNumber,
        CUSTOM_CHALLENGE_PARAM: "custom_challenge_value",
      },
    };

    let signInResponse;
    try {
      signInResponse = await this.cognitoIdentityServiceProvider
        .adminInitiateAuth(signInParams)
        .promise();
    } catch (error) {
      console.log("signInResponse Catch err");
      console.log(error);
      return {
        status: false,
        data: {
          message: error?.message ? error.message : error.toString(),
          errorType: "sign_up_error",
        },
      };
    }

    return signInResponse;
  };
}

export default CognitoController;
