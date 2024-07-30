import { NextRequest, NextResponse } from "next/server";

export type EdgeMiddlewareNextFunction = () => Promise<NextResponse> | NextResponse;
export type EdgeMiddleware = (
    req: NextRequest,
    next: EdgeMiddlewareNextFunction
) => Promise<NextResponse> | NextResponse;

export const composeMiddlewares = (middleware: EdgeMiddleware[]) => {
    return async (req: NextRequest): Promise<NextResponse> => {
        let index = -1;

        const dispatch = async (i: number): Promise<NextResponse> => {
            if (i <= index) throw new Error('next() called multiple times');

            index = i;

            let fn = middleware[i];

            if (i === middleware.length) {
                fn = () => NextResponse.next();
            }

            if (!fn) return NextResponse.next();

            return fn(req, () => dispatch(i + 1));
        };

        return dispatch(0);
    };
};