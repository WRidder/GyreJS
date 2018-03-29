function greeter(person: string, somevar: bool = true) {
  return "Hello, " +person;
}

var krunal = greeter('krunal');
var krunal = greeter('krunal', false);
console.log(krunal);
