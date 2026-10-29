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
// import Fade from "@mui/material/Fade";

// Material Dashboard 2 React base styles
import colors from "shared/theme/dark/base/colors";
import breakpoints from "shared/theme/dark/base/breakpoints";
import typography from "shared/theme/dark/base/typography";
import boxShadows from "shared/theme/dark/base/boxShadows";
import borders from "shared/theme/dark/base/borders";
import globals from "shared/theme/dark/base/globals";

// Material Dashboard 2 React helper functions
import boxShadow from "shared/theme/dark/functions/boxShadow";
import hexToRgb from "shared/theme/dark/functions/hexToRgb";
import linearGradient from "shared/theme/dark/functions/linearGradient";
import pxToRem from "shared/theme/dark/functions/pxToRem";
import rgba from "shared/theme/dark/functions/rgba";

// Material Dashboard 2 React components base styles for @mui material components
import sidenav from "shared/theme/dark/components/sidenav";
import list from "shared/theme/dark/components/list";
import listItem from "shared/theme/dark/components/list/listItem";
import listItemText from "shared/theme/dark/components/list/listItemText";
import card from "shared/theme/dark/components/card";
import cardMedia from "shared/theme/dark/components/card/cardMedia";
import cardContent from "shared/theme/dark/components/card/cardContent";
import button from "shared/theme/dark/components/button";
import iconButton from "shared/theme/dark/components/iconButton";
import input from "shared/theme/dark/components/form/input";
import inputLabel from "shared/theme/dark/components/form/inputLabel";
import inputOutlined from "shared/theme/dark/components/form/inputOutlined";
import textField from "shared/theme/dark/components/form/textField";
import menu from "shared/theme/dark/components/menu";
import menuItem from "shared/theme/dark/components/menu/menuItem";
import switchButton from "shared/theme/dark/components/form/switchButton";
import divider from "shared/theme/dark/components/divider";
import tableContainer from "shared/theme/dark/components/table/tableContainer";
import tableHead from "shared/theme/dark/components/table/tableHead";
import tableCell from "shared/theme/dark/components/table/tableCell";
import linearProgress from "shared/theme/dark/components/linearProgress";
import breadcrumbs from "shared/theme/dark/components/breadcrumbs";
import slider from "shared/theme/dark/components/slider";
import avatar from "shared/theme/dark/components/avatar";
import tooltip from "shared/theme/dark/components/tooltip";
import appBar from "shared/theme/dark/components/appBar";
import tabs from "shared/theme/dark/components/tabs";
import tab from "shared/theme/dark/components/tabs/tab";
import stepper from "shared/theme/dark/components/stepper";
import step from "shared/theme/dark/components/stepper/step";
import stepConnector from "shared/theme/dark/components/stepper/stepConnector";
import stepLabel from "shared/theme/dark/components/stepper/stepLabel";
import stepIcon from "shared/theme/dark/components/stepper/stepIcon";
import select from "shared/theme/dark/components/form/select";
import formControlLabel from "shared/theme/dark/components/form/formControlLabel";
import formLabel from "shared/theme/dark/components/form/formLabel";
import checkbox from "shared/theme/dark/components/form/checkbox";
import radio from "shared/theme/dark/components/form/radio";
import autocomplete from "shared/theme/dark/components/form/autocomplete";
import container from "shared/theme/dark/components/container";
import popover from "shared/theme/dark/components/popover";
import buttonBase from "shared/theme/dark/components/buttonBase";
import icon from "shared/theme/dark/components/icon";
import svgIcon from "shared/theme/dark/components/svgIcon";
import link from "shared/theme/dark/components/link";
import dialog from "shared/theme/dark/components/dialog";
import dialogTitle from "shared/theme/dark/components/dialog/dialogTitle";
import dialogContent from "shared/theme/dark/components/dialog/dialogContent";
import dialogContentText from "shared/theme/dark/components/dialog/dialogContentText";
import dialogActions from "shared/theme/dark/components/dialog/dialogActions";

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
