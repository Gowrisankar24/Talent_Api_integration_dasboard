import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { parseDateString } from "@/utils";

const Middleware = (req) => {
  let NEXT_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN;
  const cookieData = req.cookies.get(NEXT_TOKEN);
  const pathName = req.nextUrl.pathname;
  const isProd = process.env.NODE_ENV === 'production';
  const roourl = isProd ? 'https://talent-api-integration-dasboard.vercel.app/' : 'http://localhost:3000'
  if (pathName.toLowerCase() === "/login") {
    if (cookieData && cookieData?.value) {
      return NextResponse.redirect(roourl);
    }
  }

  if (
    pathName.toLowerCase().includes("dashboardx") ||
    pathName.toLowerCase() == "/"
  ) {
    if (cookieData && cookieData?.value) {
      const decoded = jwtDecode(cookieData?.value);
      let beginningTime = moment(Date.now()).format("DD-MM-YYYY hh:mm:ss");
      let endTime = moment.unix(decoded.exp).format("DD-MM-YYYY hh:mm:ss");
      let parsedBeginningTime = parseDateString(beginningTime);
      let parsedEndTime = parseDateString(endTime);
      if (decoded && parsedBeginningTime > parsedEndTime) {
        req.cookies.has(NEXT_TOKEN) && req.cookies.delete(NEXT_TOKEN);
        return NextResponse.redirect(roourl + "/login");
      } else {
        return NextResponse.next();
      }
    } else {
      return NextResponse.redirect(roourl + "/login");
    }
  }
  return NextResponse.next();
  // }
  // return NextResponse.next();
};

export default Middleware;
