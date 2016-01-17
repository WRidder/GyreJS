setTimeout(function() {
  $(document).foundation();
  for (var i = 0; i < 50000; i++) {
    console.log(i);
  }
  console.log("end!");
  if (window.opener) {
    console.log("window opener", window.opener);
  }
}, 0);
