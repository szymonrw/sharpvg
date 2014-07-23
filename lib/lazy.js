"use strict";

module.exports = lazy;

var I = require("ancient-oak");

function lazy (generator, value) {
  value = I(value);

  var list = Object.freeze({
    value: value,
    next:  next,
    find:  find,
    last:  last,
    all:   all
  });

  return list;

  function next () {
    return lazy(generator, generator(value));
  }

  function find (condition) {
    return lazy_find(list, condition);
  }

  function last (condition) {
    return lazy_last(list);
  }

  function all () {
    return lazy_all(list);
  }
}

function lazy_last (list) {
  var next = list;

  while (next.value !== null) {
    list = next;
    next = next.next();
  }

  return list.value;
}

function lazy_all (list) {
  var result = I([]);
  while (list.value !== null) {
    result = result.push(list.value);
    list = list.next();
  }
  return result;
}

function lazy_find (list, condition) {
  var head = list.value;

  while (head !== null && condition(head)) {
    list = list.next();
    head = list.value;
  }

  return list;
}
