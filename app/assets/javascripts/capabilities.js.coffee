$(document).ready(() ->
  $('.sortable').tablesorter({headers: { 0: { sorter: false}}, sortList: [[1,0]]});
  true
);
