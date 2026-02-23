
# 🚀 Código Actualizado para Google Apps Script (con Email)

Este código ahora guarda los datos en tu Excel y te envía un correo automático a la dirección configurada.

```javascript
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    
    // 1. Guardar datos en el Excel
    sheet.appendRow([
      data.id,
      data.fecha,
      data.producto,
      data.cliente,
      data.nif,
      data.email,
      data.direccion,
      data.unidades,
      data.envio,
      data.total,
      data.idioma
    ]);
    
    // 2. Enviar notificación por email
    var subject = "🚀 NUEVO PRESUPUESTO: " + data.id + " - " + data.cliente;
    var body = "Resumen de la solicitud:\n\n" +
               "Cliente: " + data.cliente + "\n" +
               "Email: " + data.email + "\n" +
               "Producto: " + data.producto + "\n" +
               "Total: " + data.total + "€";
    
    MailApp.sendEmail(data.email_admin, subject, body);
    
    return ContentService.createTextOutput("Éxito").setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
```

---
*Fundación ASPACE Salamanca - Departamento de Innovación*
