// export const API_URL = process.env.NODE_ENV === 'production' ? 'https://test.rasberry-berry.com/' : "http://localhost:8000";

// export const API_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://raspberry.herokuapp.com"
//     : "http://localhost:8000";
// export const S3_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://s3.ap-northeast-2.amazonaws.com/myapp3.com/"
//     : "http://localhost:8000";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://raspberry.herokuapp.com"
    : "https://raspberry.herokuapp.com";
export const S3_URL =
  process.env.NODE_ENV === "production"
    ? "https://s3.ap-northeast-2.amazonaws.com/myapp3.com/"
    : "https://s3.ap-northeast-2.amazonaws.com/myapp3.com/";
