import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const sheetSelect = formData.get("sheet")
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

    // Convert first sheet to JSON
    const sheetName = workbook.SheetNames[sheetSelect];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);
    return NextResponse.json({ data: jsonData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
