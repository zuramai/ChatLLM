use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;

pub struct GeneralResponse<T: Serialize> {
    pub status: StatusCode,
    pub body: ResponseBody<T>,
}

#[derive(Serialize)]
pub struct ResponseBody<T: Serialize> {
    pub message: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<T>,
}

impl<T: Serialize> GeneralResponse<T> {
    pub fn new_without_data(status: StatusCode, message: &'static str) -> Self {
        Self {
            body: ResponseBody {
                message,
                data: None,
            },
            status,
        }
    }
    pub fn new_with_data(status: StatusCode, message: &'static str, data: T) -> Self {
        Self {
            body: ResponseBody {
                message,
                data: Some(data),
            },
            status,
        }
    }
}

impl<T: Serialize> IntoResponse for GeneralResponse<T> {
    fn into_response(self) -> axum::response::Response {
        (self.status, Json(self.body)).into_response()
    }
}