import { NextRequest, NextResponse } from "next/server"

function emptyProxy(request: NextRequest): NextResponse {
  /* istanbul ignore next */
  return NextResponse.next({
    request: {
      headers: request.headers
    }
  })
}

export function createI18nProxy(proxy: (request: NextRequest) => NextResponse | undefined = emptyProxy) {
  return (request: NextRequest) => {

    return proxy(request) || NextResponse.next({
      request: {
        headers: request.headers
      }
    })
  }
}
