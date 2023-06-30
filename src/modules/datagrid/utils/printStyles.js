export const getPrintStyles = `
    .no-print {
        display: none
    }
    .A3.landscape {
        width: 420mm;
    }
    .A3, .A4.landscape {
        width: 297mm
    }
    .A4, .A5.landscape {
        width: 210mm
    }
    .A5 {
        width: 148mm !important;
    }
    .print-table {
	 max-width: 100%;
	 width: 100%;
	 border-collapse: collapse;
	 border: 0;
	 border-left: 0;
	 border-right: 0;
	 border-top: 0;
	 margin-top: -1px;
}
 .print-table thead, .print-table tbody {
	 background: #eee;
}
 .print-table thead tr td, .print-table tbody tr td {
	 font-size: 10px;
	 color: #545454;
	 text-align: center;
	 vertical-align: middle;
	 border-color: #ccc;
	 padding: 3px 2px;
	 overflow: hidden;
}
 .print-table thead tr td > div, .print-table tbody tr td > div {
	 font-size: 12px;
	 text-align: center;
}
 .print-table tbody {
	 background: #fff;
}
}`;
