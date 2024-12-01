#!/usr/bin/env python3

import sys
import json
from tika import parser

def extract_text_from_pdf(pdf_path):
    try:
        # Parse PDF using Tika
        raw = parser.from_file(pdf_path)
        text = raw['content']
        
        if text:
            # Basic text cleanup
            text = ' '.join(text.split()) 
            return {"success": True, "text": text}
        else:
            return {"success": False, "error": "No text content found"}
            
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"success": False, "error": "Please provide PDF file path"}))
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    result = extract_text_from_pdf(pdf_path)
    print(json.dumps(result))
