import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const f = req.nextUrl.searchParams.get("f");
  if (!f) return new NextResponse("No file parameter", { status: 400 });

  try {
    const decodedPath = Buffer.from(f, "base64").toString("utf-8"); // e.g. /uploads/video.mp4
    if (decodedPath.includes("..")) return new NextResponse("Invalid path", { status: 400 });

    const absolutePath = path.join(process.cwd(), "public", decodedPath);
    if (!fs.existsSync(absolutePath)) return new NextResponse("File not found", { status: 404 });

    const stat = fs.statSync(absolutePath);
    const range = req.headers.get("range");
    
    const ext = path.extname(absolutePath).toLowerCase();
    let contentType = "application/octet-stream";
    if (ext === ".mp4") contentType = "video/mp4";
    else if (ext === ".webm") contentType = "video/webm";
    else if (ext === ".mp3") contentType = "audio/mpeg";
    else if (ext === ".ogg") contentType = "audio/ogg";
    else if (ext === ".wav") contentType = "audio/wav";

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(absolutePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize.toString(),
        "Content-Type": contentType,
        // Crucial header to override IDM auto-download behaviors on direct media files
        "Content-Disposition": "inline", 
      };
      return new NextResponse(file as any, { status: 206, headers: head });
    } else {
      const head = {
        "Content-Length": stat.size.toString(),
        "Content-Type": contentType,
        "Content-Disposition": "inline",
      };
      const file = fs.createReadStream(absolutePath);
      return new NextResponse(file as any, { status: 200, headers: head });
    }
  } catch (error) {
    console.error("Streaming error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
