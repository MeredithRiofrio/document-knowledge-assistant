/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import { createTheme } from "@mui/material/styles";

// Material Dashboard 2 React base styles
import colors from "shared/theme/light/base/colors";
import breakpoints from "shared/theme/light/base/breakpoints";
import typography from "shared/theme/light/base/typography";
import boxShadows from "shared/theme/light/base/boxShadows";
import borders from "shared/theme/light/base/borders";
import globals from "shared/theme/light/base/globals";

// Material Dashboard 2 React helper functions
import boxShadow from "shared/theme/light/functions/boxShadow";
import hexToRgb from "shared/theme/light/functions/hexToRgb";
import linearGradient from "shared/theme/light/functions/linearGradient";
import pxToRem from "shared/theme/light/functions/pxToRem";
import rgba from "shared/theme/light/functions/rgba";

// Material Dashboard 2 React components base styles for @mui material components
import sidenav from "shared/theme/light/components/sidenav";
import list from "shared/theme/light/components/list";
import listItem from "shared/theme/light/components/list/listItem";
import listItemText from "shared/theme/light/components/list/listItemText";
import card from "shared/theme/light/components/card";
import cardMedia from "shared/theme/light/components/card/cardMedia";
import cardContent from "shared/theme/light/components/card/cardContent";
import button from "shared/theme/light/components/button";
import iconButton from "shared/theme/light/components/iconButton";
import input from "shared/theme/light/components/form/input";
import inputLabel from "shared/theme/light/components/form/inputLabel";
import inputOutlined from "shared/theme/light/components/form/inputOutlined";
import textField from "shared/theme/light/components/form/textField";
import menu from "shared/theme/light/components/menu";
import menuItem from "shared/theme/light/components/menu/menuItem";
import switchButton from "shared/theme/light/components/form/switchButton";
import divider from "shared/theme/light/components/divider";
import tableContainer from "shared/theme/light/components/table/tableContainer";
import tableHead from "shared/theme/light/components/table/tableHead";
import tableCell from "shared/theme/light/components/table/tableCell";
import linearProgress from "shared/theme/light/components/linearProgress";
import breadcrumbs from "shared/theme/light/components/breadcrumbs";
import slider from "shared/theme/light/components/slider";
import avatar from "shared/theme/light/components/avatar";
import tooltip from "shared/theme/light/components/tooltip";
import appBar from "shared/theme/light/components/appBar";
import tabs from "shared/theme/light/components/tabs";
import tab from "shared/theme/light/components/tabs/tab";
import stepper from "shared/theme/light/components/stepper";
import step from "shared/theme/light/components/stepper/step";
import stepConnector from "shared/theme/light/components/stepper/stepConnector";
import stepLabel from "shared/theme/light/components/stepper/stepLabel";
import stepIcon from "shared/theme/light/components/stepper/stepIcon";
import select from "shared/theme/light/components/form/select";
import formControlLabel from "shared/theme/light/components/form/formControlLabel";
import formLabel from "shared/theme/light/components/form/formLabel";
import checkbox from "shared/theme/light/components/form/checkbox";
import radio from "shared/theme/light/components/form/radio";
import autocomplete from "shared/theme/light/components/form/autocomplete";
import container from "shared/theme/light/components/container";
import popover from "shared/theme/light/components/popover";
import buttonBase from "shared/theme/light/components/buttonBase";
import icon from "shared/theme/light/components/icon";
import svgIcon from "shared/theme/light/components/svgIcon";
import link from "shared/theme/light/components/link";
import dialog from "shared/theme/light/components/dialog";
import dialogTitle from "shared/theme/light/components/dialog/dialogTitle";
import dialogContent from "shared/theme/light/components/dialog/dialogContent";
import dialogContentText from "shared/theme/light/components/dialog/dialogContentText";
import dialogActions from "shared/theme/light/components/dialog/dialogActions";

export default createTheme({
  breakpoints: { ...breakpoints },
  palette: { ...colors },
  typography: { ...typography },
  boxShadows: { ...boxShadows },
  borders: { ...borders },
  functions: {
    boxShadow,
    hexToRgb,
    linearGradient,
    pxToRem,
    rgba,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ...globals,
        ...container,
      },
    },
    MuiDrawer: { ...sidenav },
    MuiList: { ...list },
    MuiListItem: { ...listItem },
    MuiListItemText: { ...listItemText },
    MuiCard: { ...card },
    MuiCardMedia: { ...cardMedia },
    MuiCardContent: { ...cardContent },
    MuiButton: { ...button },
    MuiIconButton: { ...iconButton },
    MuiInput: { ...input },
    MuiInputLabel: { ...inputLabel },
    MuiOutlinedInput: { ...inputOutlined },
    MuiTextField: { ...textField },
    MuiMenu: { ...menu },
    MuiMenuItem: { ...menuItem },
    MuiSwitch: { ...switchButton },
    MuiDivider: { ...divider },
    MuiTableContainer: { ...tableContainer },
    MuiTableHead: { ...tableHead },
    MuiTableCell: { ...tableCell },
    MuiLinearProgress: { ...linearProgress },
    MuiBreadcrumbs: { ...breadcrumbs },
    MuiSlider: { ...slider },
    MuiAvatar: { ...avatar },
    MuiTooltip: { ...tooltip },
    MuiAppBar: { ...appBar },
    MuiTabs: { ...tabs },
    MuiTab: { ...tab },
    MuiStepper: { ...stepper },
    MuiStep: { ...step },
    MuiStepConnector: { ...stepConnector },
    MuiStepLabel: { ...stepLabel },
    MuiStepIcon: { ...stepIcon },
    MuiSelect: { ...select },
    MuiFormControlLabel: { ...formControlLabel },
    MuiFormLabel: { ...formLabel },
    MuiCheckbox: { ...checkbox },
    MuiRadio: { ...radio },
    MuiAutocomplete: { ...autocomplete },
    MuiPopover: { ...popover },
    MuiButtonBase: { ...buttonBase },
    MuiIcon: { ...icon },
    MuiSvgIcon: { ...svgIcon },
    MuiLink: { ...link },
    MuiDialog: { ...dialog },
    MuiDialogTitle: { ...dialogTitle },
    MuiDialogContent: { ...dialogContent },
    MuiDialogContentText: { ...dialogContentText },
    MuiDialogActions: { ...dialogActions },
  },
});
