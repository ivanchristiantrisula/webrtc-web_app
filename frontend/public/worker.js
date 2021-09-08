let array = [];
self.addEventListener("message", (event) => {
  if (event.data === "download") {
    const blob = new Blob(array);
    self.postMessage(blob);
  } else {
    array.push(event.data);
  }
});
