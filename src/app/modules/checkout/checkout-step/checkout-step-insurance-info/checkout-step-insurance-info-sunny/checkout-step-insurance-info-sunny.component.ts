/// <reference types="@types/googlemaps" />
import {Component, OnInit, ViewChild} from '@angular/core';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {of} from 'rxjs/internal/observable/of';
import {Observable} from 'rxjs';
import {CheckoutStepInsuranceInfoHelper} from '../checkout-step-insurance-info.helper';
import {InsuranceInfoAttributes, LineFirstItem} from '@model';
import {DataService} from '@services';

@Component({
  selector: 'app-checkout-step-insurance-info-sunny',
  templateUrl: './checkout-step-insurance-info-sunny.component.html',
  styleUrls: ['./checkout-step-insurance-info-sunny.component.scss']
})
export class CheckoutStepInsuranceInfoSunnyComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  @ViewChild('map', { static: true }) mapElement: any;
  destination: any;
  mapsConfiguration: any;
  map: google.maps.Map;
  markerPrimary: {marker: google.maps.Marker, icon: string, label: string, distance: string};
  markerSecondary: {marker: google.maps.Marker, icon: string, label: string, distance: string};

  constructor(public dataService: DataService) {
    super();
  }

  ngOnInit() {
    const responseOrder = this.dataService.getResponseOrder();
    this.destination = responseOrder.line_items[0].insurance_info.travel_destination;
    this.mapsConfiguration = responseOrder.data;
    const mapProperties = {
      center: new google.maps.LatLng(
        parseFloat(this.mapsConfiguration.primary_station.luogo.split(',')[0]),
        parseFloat(this.mapsConfiguration.primary_station.luogo.split(',')[1])),
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);
    this.gMapsMarkers(this.mapsConfiguration.primary_station, this.mapsConfiguration.backup_station);
    this.product.costItems[0].amount = responseOrder.line_items[0].total;
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return Object.assign({}, this.product, {insuredSubjects: null});
  }

  computeQuotationRequest(product: CheckoutStepInsuranceInfoProduct) {
    return Object.assign({
      id: this.product.id,
      variant_id: this.product.variantId,
      quantity: product.quantity,
      insured_is_contractor: product.insuredIsContractor
    }, CheckoutStepInsuranceInfoHelper.convertInsuredSubjectsToOrderAttributes(product.insuredSubjects));
  }

  isFormValid(): boolean {
    return true;
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  fillLineItem(lineItem: LineFirstItem): void {
    const responseOrder = this.dataService.getResponseOrder();
    lineItem.quantity = this.product.quantity;
    lineItem.insured_is_contractor = this.product.insuredIsContractor;
    const insuranceInfoAttributes = lineItem.insurance_info_attributes || new InsuranceInfoAttributes();
    insuranceInfoAttributes['travel_destination'] = this.destination;
    insuranceInfoAttributes['quotation_number'] = responseOrder.data.quotation_response.id_preventivo;
    lineItem.insurance_info_attributes = insuranceInfoAttributes;
  }


  gMapsMarkers(markerPrimary, markerSecondary) {
    this.markerPrimary = {
      marker: new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(markerPrimary.luogo.split(',')[0]), parseFloat(markerPrimary.luogo.split(',')[1])),
        map: this.map,
        icon: './assets/images/icons/Sunny-maps-dark.png',
        zIndex: 1
      }),
      icon: './assets/images/icons/Sunny-maps-dark.png',
      label: markerPrimary.nome,
      distance: markerPrimary.distanza
    };
    this.markerSecondary = {
      marker: new google.maps.Marker({
        position: new google.maps.LatLng(parseFloat(markerSecondary.luogo.split(',')[0]), parseFloat(markerSecondary.luogo.split(',')[1])),
        map: this.map,
        icon: './assets/images/icons/Sunny-maps-light.png',
        zIndex: 1,
      }),
      icon: './assets/images/icons/Sunny-maps-light.png',
      label: markerSecondary.nome,
      distance: markerSecondary.distanza
    };
  }

}
