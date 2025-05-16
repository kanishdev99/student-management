import { LightningElement } from 'lwc';

export default class EventMapViewer extends LightningElement {
  mapMarkers = [
    {
  location: {
    Latitude: 27.552990,
    Longitude: 76.634573
  },
  title: 'Alwar Event',
  description: 'Registrations: 50'
},
    
    
  ];

  center = {
    latitude: 23.2599,
    longitude: 77.4126 // Center of India
  };
}
