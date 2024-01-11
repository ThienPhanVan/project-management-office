import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as cheerio from 'cheerio';
@Injectable({
  providedIn: 'root',
})
export class MetaDataService {
  constructor(private http: HttpClient) {}
  getMetadata(url: string): Promise<any> {
    return this.http
      .get(url, { responseType: 'text' })
      .toPromise()
      .then((html: any) => {
        const $ = cheerio.load(html);
        const metaData: any = {};

        $('head meta').each((index, element) => {
          const key = $(element).attr('name') || $(element).attr('property');
          const value = $(element).attr('content');

          if (key && value) {
            metaData[key] = value;
          }
        });

        return metaData;
      })
      .catch((error: any) => {
        console.error('Error fetching website metadata:', error);
        return null;
      });
  }
}
