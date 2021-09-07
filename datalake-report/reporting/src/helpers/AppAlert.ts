import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class AppAlert {
    private isAlertVisible: boolean = false;

    constructor(private alertCtrl: AlertController) { }

    /**
     * 
     * @param error = 
     *              {
     *                  status: err.status,
                        message: "Error",
                        reason: err.reason || null
                    }
     */
    public showServerError(error: {
        status: any,
        message: string,
        reason: any
    }) {
        this.showError(
            error.message ? error.message : 'Unknown Server error',
            error.reason ? JSON.stringify(error.reason) : null,
            error.status ? `Server Error ${error.status}` : null);
    }

    public showError(subTitle: string, message?: string, title?: string) {
        let showingDetails: boolean = false;

        let alert = this.alertCtrl.create({
            title: title || 'ERROR',
            subTitle: subTitle,
            buttons: ['Dismiss']
        });

        if (message) {
            alert.addButton({
                text: 'Details',
                handler: () => {
                    showingDetails = !showingDetails;
                    if (showingDetails) {
                        alert.setMessage(message);
                    } else {
                        alert.setMessage(null);
                    }
                    return false;
                }
            });
        }

        alert.onDidDismiss(() => this.isAlertVisible = false);

        if (!this.isAlertVisible) {
            alert.present().then(() => this.isAlertVisible = true);
        }
    }
}