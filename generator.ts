export async function generateHTML(data: any[]): Promise<string> {
  let html = /*html*/`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Data from Database</title>
    </head>
    <body>
      <h1>Data from Database</h1>
      <ul>
  `
  data.forEach((item) => {

    html += /*html*/`
        <li>Name: ${item.name}</li>
        <li>Species: ${item.species}</li>
        <li>Age: ${item.age}</li>
        <li>Date Admitted: ${item.created_at}</li>
        <li>Date Updated: ${item.updated_at}</li>
        <li>Status: ${item.status}</li>
        <li>Token: ${item.token}</li>
        <br> <br>
    `;
  });
  html += /*html*/`
        <form action="/homepage">
          <button type="submit">Back to Homepage</button>
        </form>
      </ul>
    </body>
    </html>
  `;
  return html;
};