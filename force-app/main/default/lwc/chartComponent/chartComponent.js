import { LightningElement, wire } from 'lwc';
import ChartJs from '@salesforce/resourceUrl/chartjs';
import { loadScript } from 'lightning/platformResourceLoader';
import getEventRegistrationCount from '@salesforce/apex/RegistrationChartController.getEventRegistrationCount';

export default class ChartComponentLWC extends LightningElement {
    chart;
    chartJsLoaded = false;
    dataLoaded = false;
    chartData;

    @wire(getEventRegistrationCount)
    wiredData({ error, data }) {
        if (data) {
            this.prepareChartData(data);
            this.dataLoaded = true;
            this.tryRenderChart();
        } else if (error) {
            console.error('Apex wire error:', error);
        }
    }

    renderedCallback() {
        if (this.chartJsLoaded) return;

        loadScript(this, ChartJs)
            .then(() => {
                this.chartJsLoaded = true;
                this.tryRenderChart();
            })
            .catch(error => {
                console.error('Chart.js load error:', error);
            });
    }

    prepareChartData(data) {
        const labels = data.map(item => item.eventName);
        const counts = data.map(item => parseInt(item.count, 10));

        this.chartData = {
            labels,
            datasets: [{
                label: 'Total Registrations',
                data: counts,
                backgroundColor: labels.map(() => this.getRandomColor())
            }]
        };
    }

    tryRenderChart() {
        if (!this.chartJsLoaded || !this.dataLoaded) return;

        const canvas = this.template.querySelector('canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new window.Chart(ctx, {
            type: 'bar', // ✅ BAR CHART
            data: this.chartData,
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: 'Total Registrations Per Event'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Registrations' }
                    },
                    x: {
                        title: { display: true, text: 'Events' }
                    }
                }
            }
        });
    }

    getRandomColor() {
        const colors = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#FFC107', '#03A9F4', '#E91E63', '#00BCD4'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}