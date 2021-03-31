import { NextFunction, Request, Response } from "express";

/**
 * elimina los espacios en blanco de los campos durante el registro, excepto la contraseña
 */
export default (req: Request, _: Response, next: NextFunction) => {

    const exceptions = ['password']

    Object.keys(req.body).forEach(key => {
        if(!exceptions.includes(key) && typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    })

    next();
}