import { getPost } from "./posts.js";
export const getAllComments = async () => {
    let res = await fetch("http://172.16.101.146:5801/comments");
    let data = await res.json();
    return data;
};

const validateAddComments = async ({ postId, name, email, body }) => {
    if (typeof name !== "string" || name === undefined) return { status: 406, message: ` The data ${name} is not arriving or does not comply with the requiered format` }
    if (typeof email !== "string" || email === undefined) return { status: 406, message: ` The data ${email} is not arriving or does not comply with the requiered format` }
    if (typeof body !== "string" || body === undefined) return { status: 406, message: ` The data ${body} is not arriving or does not comply with the requiered format` }
    let user = await getPost({ postId })
    if (user.status == 204) return { status: 200, message: `Post does not exist` }
}

export const addComments = async (arg) => {
    let val = await validateAddComments(arg);
    if (val) return val;
    let config = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg)
    };
    let res = await fetch("http://172.16.101.146:5801/comments", config);
    let data = await res.json();
    return data;
};

export const updateComments = async (arg) => {
    let val = await validateAddComments(arg);
    if (val) return val;
    let { id } = arg
    let config = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg)
    };
    let res = await fetch(`http://172.16.101.146:5801/comments/${id}`, config);
    let data = await res.json();
    return data;
}
const validateUpdateComments = async ({ postId, name, email, body }) => {
    let errors = {};

    if (name !== undefined) {
        if (typeof name !== "string") {
            errors.name = `The data name is not arriving or does not comply with the required format`;
        }
    }

    if (email !== undefined) {
        if (typeof email !== "string") {
            errors.email = `The data email is not arriving or does not comply with the required format`;
        }
    }

    if (body !== undefined) {
        if (typeof body !== "string") {
            errors.body = `The data body is not arriving or does not comply with the required format`;
        }
    }

    if (Object.keys(errors).length > 0) {
        return { status: 406, message: "Error en los datos", errors };
    }

    let user = await getPost({ postId })
    if (user.status == 204) {
        return { status: 200, message: `Post does not exist` }
    }
}

export const patchComments = async (arg) => {
    let val = await validateUpdateComments(arg);
    if (val) {
        if (val.status === 200) {
            return val;
        } else {
            return val;
        }
    }
    let { id } = arg;
    let config = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arg)
    };
    let res = await fetch(`http://172.16.101.146:5801/comments/${id}`, config);
    let data = await res.json();
    return data;
}

export const deleteComments = async (commentsId) => {
    let config = {
        method: "DELETE"
    };
    let res = await fetch(`http://172.16.101.146:5801/comments/${commentsId}`, config);
    if (res.status === 404) return { status: 204, message: "the comment id does not exist or has an unaccepted format" }
    let data = await res.json();
    data.status = 202;
    data.message = `The comment ${commentsId} was deleted from the database`
    return data;
}