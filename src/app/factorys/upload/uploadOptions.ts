import {SafeResourceUrl} from "@angular/platform-browser";

export default interface uploadOptions {
  size: {
    width: string;
    height?: string;
  };
  icon: SafeResourceUrl | string;
  showProgress: boolean;
  groupId?: string;
}
