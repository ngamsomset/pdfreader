const url = 'docs/pdf.pdf';


// Set starting value
let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

// Canvas Size
const scale = 1.5,
// Put the PDF on the canvas
  canvas = document.querySelector('#pdf-render'),
// Display context in 2d
  ctx = canvas.getContext('2d');



// Render the page
const renderPage = num => {
  pageIsRendering = true;

  // Get  the  page
  pdfDoc.getPage(num).then(page => {
    // Set Scale
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    }

    page.render(renderCtx).promise.then(() => {
      pageIsRendering =  false;

      if(pageNumIsPending != null){
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // OutPut current page

    document.querySelector('#page-num').textContent = num;
  });

};

// Check for  pages rendering

const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
}


// Show Prev Page

const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}

// Show Next Page
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}


// Get the Document
// this  method come from the github pdf.js that  we link in the html.

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;

  document.querySelector('#page-count').textContent = pdfDoc.numPages;
  renderPage(pageNum);
})
  .catch(err => {
    // Display Error

    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Remove the top bar
    document.querySelector('.top-bar').style.display = 'none';
  });


// Button Event
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);
