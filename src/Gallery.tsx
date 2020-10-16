import { RouteComponentProps } from '@reach/router';
import { AxiosResponse } from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { IDataTitlesIndex } from './models/common.model';
import { getGalleryList } from './services/globalData.service';
import { Carousel } from 'primereact/carousel';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import './Gallery.scss';


interface IProps extends RouteComponentProps {}

const GalleryComponent: FunctionComponent<IProps> = () => {
  const [list, setList] = useState<IDataTitlesIndex>();
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [dialogHeader, setDialogHeader] = useState('');
  const imageDir = 'galleryPics/';
  const responsiveOptions = [
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
    },
    {
        breakpoint: '600px',
        numVisible: 2,
        numScroll: 2
    },
    {
        breakpoint: '480px',
        numVisible: 1,
        numScroll: 1
    }
];

const openImage = (e: any) => {
  const path = e.target.src;
  const fileName = path.split('galleryPics/');
  setDialogHeader(getImageDate(fileName[1]));
  setOpenDialog(path);
};

const getImageDate = (image: string) => {
  const imageDate = image.split('_')[0];
  const dateSplit = imageDate.split('-');
  return `${dateSplit[1]}/${dateSplit[2]}/${dateSplit[0]}`;
};

  const slideTemplate = (image: string) => {
    const imageDate = getImageDate(image);
    return (
        <div className="slide-template">
          <img src={`${imageDir}${image}`} alt="" onClick={openImage} />
          <h4>{imageDate}</h4>
        </div>
    );
  };

  useEffect(() => {
    getGalleryList()
      .then((list: AxiosResponse) => {
        setList(list.data);
      })  
      .catch(error => {
        console.log('gallery list error', error);
      });
  }, []);
  return (
    <div className="gallery-wrapper">
      {list && Object.keys(list as IDataTitlesIndex).map(key => {
        if (key && list && list[key]) {
          return (
            <Card className="carousel-card">
              <Carousel value={list[key]} numVisible={4} numScroll={4} header={<h2>{key}</h2>} itemTemplate={slideTemplate} responsiveOptions={responsiveOptions} />
              <Dialog header={dialogHeader} visible={!!openDialog} onHide={() => setOpenDialog(null)}>
                <div className="dialog-image">
                  <img src={openDialog as string} alt="" className="dialog-image--image" />
                </div>
              </Dialog>
            </Card>
          )
        }
      })}
    </div>
  );
};

export default GalleryComponent;