import Page1Design from 'generated/pages/page1';
import PageTitleLayout from 'components/PageTitleLayout';
import System from '@smartface/native/device/system';
import { Route, Router } from '@smartface/router';
import { withDismissAndBackButton } from '@smartface/mixins';
import Application from "@smartface/native/application";
import { styleableComponentMixin, styleableContainerComponentMixin } from '@smartface/styling-context';
import Http from "@smartface/native/net/http";
import Button from "@smartface/native/ui/button";
import Share from "@smartface/native/global/share";
import Image from '@smartface/native/ui/image';
import Color from '@smartface/native/ui/color';
import Simple_listviewitem from 'components/Simple_listviewitem';
import Screen from "@smartface/native/device/screen";
import GridViewItem1 from 'components/GridViewItem1';
import { ScrollDirection } from '@smartface/native/ui/layoutmanager/layoutmanager';


type DatasetType = { title: string; backgroundColor: Color };
const SPAN_COUNT: number = 2;
const COLORS: string[] = [
  "#ffffff",
  "#e6f7ff",
  "#cceeff",
  "#b3e6ff",
  "#99ddff",
  "#80d4ff",
  "#66ccff",
  "#4dc3ff",
  "#33bbff",
  "#1ab2ff",
  "#00aaff",
  "#0099e6",
  "#0088cc",
  "#0077b3",
  "#006699",
];


export default class Page1 extends Page1Design {
  private disposeables: (() => void)[] = [];
  index: number = 0;
  constructor(private router?: Router, private route?: Route) {
    super({});
    console.log('[page1] constructor')
   
  }

  generateDataset(): DatasetType[] {
    let dataset: DatasetType[] = [];
    for (let i = 0; i < 12; ++i) {
      dataset.push({
        title: `Smartface Title ${i}`,
        backgroundColor: Color.create(COLORS[i % COLORS.length]),
      });
    }
    return dataset;
  }

  /**
   * @event onShow
   * This event is called when a page appears on the screen (everytime).
   */
  onShow() {
    super.onShow();
    console.log('[page1] onShow');
    // const lbl = new StyleableLabel();
    // this.addChild(lbl, 'page1lbl1unique', 'sf-label', (userProps: Record<string, any>) => {
    //   return { ...userProps };
    // });
    // lbl.text = "It's a runtime label added from code";
    // // this.headerBar.titleLayout.applyLayout();
    this.disposeables.push(
    //   this.btnNext.on('press', () => {
    //      this.router.push('page3');
    //   })
    );
    try {
        let myDataSet: DatasetType[] = this.generateDataset();
        this.gridView1.layoutManager.onItemLength = () => Screen.width / SPAN_COUNT;
        this.gridView1.refreshEnabled = true;
        this.gridView1.itemCount = myDataSet.length;
        this.gridView1.onItemBind  = (item: GridViewItem1, index: number) => {
          console.info('gridview onitembind')
            const { title, backgroundColor }: DatasetType = myDataSet[index];
            item.label1.text = title;
            item.label1.backgroundColor = backgroundColor;
        }
        // this.gridView1.onItemSelected = (gridViewItem: GridViewItem1) => {
        //     console.log(`Item title : ${gridViewItem.label1.text}`);
        // }
        this.gridView1.onPullRefresh = () => {
          console.log("onPullRefresh");
          this.gridView1.refreshData();
          this.gridView1.stopRefresh();
        }
        this.gridView1.onScroll = () => {
            // console.log("onScroll");
        }
        this.gridView1.refreshData();
    }
    catch(e) {
        console.error(e)
    }
}


  /**
   * @event onLoad
   * This event is called once when page is created.
   */
  onLoad() {
    super.onLoad();
    console.log('[page1] onLoad');
    this.headerBar.leftItemEnabled = false;

  }

  onHide(): void {
    this.dispose();
  }

  dispose(): void {
    this.disposeables.forEach((item) => item());
  }

}