const debugCss = require("!css!sass!../css/debugger_stylesheet.scss");
const debugFontsCss = require("!css!../css/foundation-icons.css");
const foundationCSS = require("!css!../css/foundation-flex.css");
const foundationJs = require("raw!./foundation.js");

export default (windowObjectReference) => {
  // Pop vars
  const popupDoc = windowObjectReference.document;
  const popupHead = popupDoc.head || popupDoc.getElementsByTagName("head")[0];

  // Clear head
  while (popupHead.firstChild) {
    popupHead.removeChild(popupHead.firstChild);
  }

  // Clear body
  popupDoc.body.innerHTML = "";

  // Attach jquery javacript
  const jqueryJs = popupDoc.createElement("script");
  jqueryJs.type = "text/javascript";
  jqueryJs.src = "https://code.jquery.com/jquery-2.2.0.min.js";

  // Attach style javacript
  const zurbStyleJS = popupDoc.createElement("script");
  zurbStyleJS.type = "text/javascript";
  zurbStyleJS.src = "https://cdn.jsdelivr.net/foundation/6.1.1/foundation.min.js";

  // Attach zurb style css link
  /*    const zurbStyleLink = popupDoc.createElement("link");
   zurbStyleLink.type = "text/css";
   zurbStyleLink.rel = "stylesheet";
   zurbStyleLink.href = "https://cdn.jsdelivr.net/foundation/6.1.1/foundation.min.css";
   popupHead.appendChild(zurbStyleLink);*/

  // Attach foundation css
  const foundationStyleTag = popupDoc.createElement("style");
  if (foundationStyleTag.styleSheet) {
    foundationStyleTag.styleSheet.cssText = foundationCSS.toString();
  }
  else {
    foundationStyleTag.appendChild(popupDoc.createTextNode(foundationCSS.toString()));
  }
  popupHead.appendChild(foundationStyleTag);

  // Attach debugger specific css
  const debuggerStyleTag = popupDoc.createElement("style");
  if (debuggerStyleTag.styleSheet) {
    debuggerStyleTag.styleSheet.cssText = debugCss.toString() + debugFontsCss.toString();
  }
  else {
    debuggerStyleTag.appendChild(popupDoc.createTextNode(debugCss.toString() + debugFontsCss.toString()));
  }
  popupHead.appendChild(debuggerStyleTag);

  // Attach popWindow specific javascript
  const popupJs = popupDoc.createElement("script");
  popupJs.type = "text/javascript";
  popupJs.text = foundationJs;

  const filesToLoadSynchronously = [jqueryJs, zurbStyleJS];
  const filesToLoadInline = [popupJs];
  let fileToLoadIndex = 0;
  const filesDone = [];
  const loadAsyncFiles = setInterval(() => {
    // if all files are loaded, return.
    if (filesDone.length === filesToLoadSynchronously.length && filesDone[filesDone.length - 1] === "finished") {
      clearInterval(loadAsyncFiles);

      // Add inline javascript
      filesToLoadInline.forEach(script => popupHead.appendChild(script));
      return;
    }

    // If file is processing, return.
    if (fileToLoadIndex + 1 === filesDone.length && filesDone[filesDone.length - 1] === "busy") {
      return;
    }

    if (filesDone.length < fileToLoadIndex + 1) {
      popupHead.appendChild(filesToLoadSynchronously[fileToLoadIndex]);
      filesDone.push("loading");

      filesToLoadSynchronously[fileToLoadIndex].onload = () => {
        filesDone[filesDone.length - 1] = "finished";
        fileToLoadIndex++;
      };
    }
  }, 50);
};
