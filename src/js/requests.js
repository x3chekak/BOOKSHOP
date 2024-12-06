const key = "AIzaSyBmzK056Ap_sCs7XQ4lTy1_zoW718QRC60";
const apiURL = "https://www.googleapis.com/books/v1/volumes"

const params = new URLSearchParams();
params.append("q", `"subject:Architecture"`);
params.append("key", `${key}`);
params.append("printType", `books`);
params.append("startIndex", `0`);
params.append("maxResults", `6`);
params.append("langRestrict", `en`);

//-------------------Запрос на сервер---------------------

async function booksRequest() {
    try {
        const response = await fetch(`${apiURL}?${params}`);
        if (!response.ok) {
            throw new Error("Response not ok");
        }
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error("ERROR:", error);
    }
}


export {booksRequest, params};