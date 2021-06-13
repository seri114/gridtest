import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { evaluate, create, all, e } from 'mathjs'
const math = create(all)

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    columnDefs = [
        { field: 'make', sortable: true },
        { field: 'model', sortable: true },
        { field: 'price', sortable: true, editable: true, filter:true, checkboxSelection:true},
        { field: 'calc', width: 400, editable: true, valueGetter: this.getEvalGetter()}
    ];
    private gridApi;
    private gridColumnApi;
    rowData: any;
    text: string = "1+2";
    _param: any;

    constructor(private http: HttpClient) {
    }
    
    onGridReady(params: any) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
    }

    ngOnInit() {
        var columnDefs = this.columnDefs
        math.import({
            get: this.getGetter()
          }, null)
        this.rowData = this.http.get('https://www.ag-grid.com/example-assets/small-row-data.json');
    }
    getEvalGetter(){
        return (params) => {
            this.param = params;
            var ret = ""
            if (!!this.text){
                try{
                    ret = math.evaluate(this.text)
                }
                catch (e){
                    ret = e;
                }
            }
            return ret ? ret : "null text";
        }
    }
    getGetter(){
        return (id : string | number) => {
            if(typeof id === 'string'){
                return this.param.getValue(id)
            }else if (typeof id === 'number'){
                return this.param.getValue(this.columnDefs[id].field)
            }
        }
    }
    
    public set param(p : any) {
        this._param = p;
    }
    
    public get param() : any {
        return this._param;
    }
    public clickButton(){
        setTimeout(this.gridApi.refreshCells({
            columns: ['calc']
        }), 0);
    }
}

