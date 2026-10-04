import Ajv, { Schema } from 'ajv';
import addFormats from 'ajv-formats';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../utils/errors';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/** Crea un middleware que valida req.body contra un JSON Schema. */
export function validateBody(schema: Schema) {
    const validate = ajv.compile(schema);

    return (req: Request, _res: Response, next: NextFunction): void => {
        if (!validate(req.body)) {
        const details = (validate.errors ?? [])
            .map((e) => `${e.instancePath || 'body'} ${e.message}`)
            .join('; ');
        return next(new ValidationError(details));
        }
        next();
    };
}