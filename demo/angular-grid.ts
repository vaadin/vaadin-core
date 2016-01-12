import {Component} from 'angular2/core';

@Component({
  selector: 'angular-grid',
  templateUrl: 'angular-grid.html'
})
export class AngularGrid {
  selected: Object;
  grid = document.querySelector('angular-grid vaadin-grid');
  columns = [
    {name: "user.picture.thumbnail", width: 100, renderer: this.pictureRenderer},
    {name: "user.gender"},
    {name: "user.name.first"},
    {name: "user.name.last"},
    {name: "user.email"},
  ];

  constructor() {
    // Once grid is ready, add a new header row with the gender select in it
    this.grid.then(() =>
      this.grid.header.addRow(1, ['', document.querySelector('angular-grid select')])
    );
  }

  pictureRenderer(cell) {
    cell.element.innerHTML = '<img style="width: 30px" src="' + cell.data + '" />';
  }

  items(params, callback) {
    var gender = document.querySelector('angular-grid select');
    var url = 'https://randomuser.me/api?nat=us&gender='
      + gender.value + '&results=' + params.count;
    getJSON(url, data =>
      callback(data ? data.results : [], gender.value ? 50 : 100)
  }

  onSelect() {
    this.selected = undefined;
    const selectedIndex = this.grid.selection.selected()[0];
    this.grid.getItem(selectedIndex, (err, data) => this.selected = data);
  }

  onFilterChange() {
    this.grid.async(() => this.grid.refreshItems());
    this.grid.scrollToStart();
  }

}
