import getTimesheets from '@salesforce/apex/GetRangeOfTimesheets.getTimesheets';
import JS_PDF from '@salesforce/resourceUrl/jsPDF';
import { loadScript } from 'lightning/platformResourceLoader';
import { LightningElement, api } from 'lwc';

export default class CreateEmployeeTimesheet extends LightningElement {

    @api recordId;
	//fetching record Id of respective pages

    Timesheets = [];
	//contains list of timesheet related to respective employee

    TimesheetLineItems = [];
	//contains list of timesheetline items respective to timesheet

    headers = [
		{id: "Day",
			name: "Day",
			prompt: "Day",
			width: 65,
			align: "center",
			padding: 0},
		{id: "dbt__Date__c",
			name: "dbt__Date__c",
			prompt: "Date",
			width: 65,
			align: "center",
			padding: 0},
		{id: "duration",
			name: "duration",
			prompt: "Day Worked",
			width: 65,
			align: "center",
			padding: 0}
		
	];
	//header of timesheet line items table

    sd;
	ed;
	dayNumber;
	weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	//to calculate day for respective date

    jsPDFInitialized = false;

    renderedCallback() {
		if (!this.jsPDFInitialized) {
			this.jsPDFInitialized = true;
			loadScript(this, JS_PDF)
				.then(() => {
					console.log('jsPDF library loaded successfully');
				})
				.catch((error) => {
					console.error('Error loading jsPDF library', error);
				});
		}
	}
	//to load the jsPDF library to the page

    handleGeneratePDF(){
        if(this.jsPDFInitialized){
            const doc = new window.jspdf.jsPDF();
            this.Timesheets.forEach(elem => {
                doc.text("Name of Contractor: "+elem.dbt__Employee__r.Name, 10, 10);
				doc.text("Digital Biz Tech", 148, 10);
			    doc.text("Name of Manager: "+elem.dbt__Manager__r.Name, 10, 30);
			    doc.text("Fortnight Ending: "+elem.dbt__End_Date__c, 10, 20);
			    doc.text("Billable Hours: "+elem.dbt__Billable_Hours__c, 10, 40);
			    doc.text("Non-Billable Hours: "+elem.dbt__Non_Billable_Hours__c, 10, 50);
			    doc.text("Total Hours: "+elem.dbt__Total_Hours__c, 10, 60);
			    doc.text("Please email Completed & Signed to: "+elem.dbt__Manager__r.Email, 10, 70);
                doc.addPage();
            });
            doc.save('generated_pdf.pdf');
        }
        else {
			console.error('jsPDF library not initialized');
		}
    }

    handleClick(){
        const startDate = this.template.querySelector('.start-date');
        const endDate = this.template.querySelector('.end-date');
		//fetch the date field element from html
		this.sd = new Date(startDate);
		this.ed = new Date(endDate);
        if(startDate.value && endDate.value){
            getTimesheets({recordID: this.recordId, startDate: this.sd, endDate: this.ed}).then(result => {
                this.Timesheets = result;
            });
            this.handleGeneratePDF();
			console.log(typeof this.ed);
			console.log(typeof this.sd);
            console.log(startDate.value);
            console.log(endDate.value);
        }

        else{
            alert('Please enter start and end date to generate Timesheets');
        }
    }
}