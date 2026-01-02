
# 🚀 CrediFlow AI - Vercel Deployment Guide

Aapka platform ab Vercel par deploy hone ke liye 100% ready hai.

## ✅ Deployment Steps

1. **GitHub Par Push Karein**:
   - Apne saare files ko ek naye GitHub repository mein upload karein.

2. **Vercel Par Import Karein**:
   - [Vercel Dashboard](https://vercel.com/dashboard) par jayein.
   - **"Add New"** -> **"Project"** par click karein.
   - Apne GitHub repo ko select karke **"Import"** karein.

3. **Environment Variables (Important)**:
   - Deployment se pehle "Environment Variables" section kholien.
   - Name: `API_KEY`
   - Value: `[Aapki Google Gemini API Key]`
   - **"Add"** par click karein.

4. **Deploy**:
   - **"Deploy"** button dabayein. 2 minute mein aapki site live ho jayegi!

## 🔧 Troubleshooting
Agar error aata hai "API Key Missing":
- Vercel Dashboard -> Settings -> Environment Variables mein check karein ki `API_KEY` sahi se add hua hai ya nahi.
- Changes ke baad ek baar "Redeploy" karein.

---
*Developed for professional Indian Banking Credit Risk Assessment.*
