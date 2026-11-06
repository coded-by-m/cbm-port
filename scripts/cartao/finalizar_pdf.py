"""Marca o PDF como PDF/X-1a:2001 (OutputIntent FOGRA39, Trapped=False, versão 1.3) e confere que só há operadores CMYK.
Uso: python scripts/cartao/finalizar_pdf.py <pasta>   (lê cartao-printi-rascunho.pdf, grava cartao-printi.pdf)"""
import datetime, os, re, sys
import pikepdf

D = sys.argv[1]
src, dst = os.path.join(D, "cartao-printi-rascunho.pdf"), os.path.join(D, "cartao-printi.pdf")
pdf = pikepdf.open(src)
bad = []
for i, page in enumerate(pdf.pages, 1):
    data = b"".join(c.read_bytes() for c in ([page.Contents] if isinstance(page.Contents, pikepdf.Stream) else page.Contents))
    for op in (rb"\srg\b", rb"\sRG\b", rb"\sg\b", rb"\sG\b", rb"\scs\b", rb"\sCS\b", rb"\sgs\b"):
        if re.search(op, data): bad.append((i, op))
    print(f"página {i}: TrimBox {[round(float(v)/72*25.4,2) for v in page.TrimBox]} mm, BleedBox {[round(float(v)/72*25.4,2) for v in page.BleedBox]} mm")
print("operadores não-CMYK:", bad or "nenhum")
for page in pdf.pages:  # o reportlab deixa a Helvetica declarada sem usar; X-1a exige toda fonte embutida
    fonts = page.Resources.get("/Font")
    if fonts is not None and "/F1" in fonts and str(fonts.F1.get("/BaseFont")) == "/Helvetica":
        del fonts["/F1"]
pdf.Root.OutputIntents = pikepdf.Array([pdf.make_indirect(pikepdf.Dictionary(
    Type=pikepdf.Name.OutputIntent, S=pikepdf.Name.GTS_PDFX,
    OutputConditionIdentifier=pikepdf.String("FOGRA39"), RegistryName=pikepdf.String("http://www.color.org"),
    Info=pikepdf.String("Coated FOGRA39 (ISO 12647-2:2004)")))])
now = datetime.datetime.now().strftime("D:%Y%m%d%H%M%S-03'00'")
with pdf.open_metadata(set_pikepdf_as_editor=False) as meta:
    meta["pdfx:GTS_PDFXVersion"] = "PDF/X-1a:2001"
pdf.docinfo["/GTS_PDFXVersion"] = "PDF/X-1a:2001"
pdf.docinfo["/GTS_PDFXConformance"] = "PDF/X-1a:2001"
pdf.docinfo["/Trapped"] = pikepdf.Name("/False")
pdf.docinfo["/CreationDate"] = now; pdf.docinfo["/ModDate"] = now
pdf.docinfo["/Title"] = "Cartão de visita Coded by M"
pdf.save(dst, force_version="1.3")
print("salvo:", dst)
