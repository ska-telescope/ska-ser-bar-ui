import {
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Divider,
  Fab,
  styled,
} from "@mui/material";

import { FindInPage } from "@mui/icons-material";

export default function BinaryUploader({
  closeCallback,
}: {
  closeCallback: Function;
}) {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <div className="mx-8 w-full max-w-3xl rounded-xl bg-white md:px-0 md:py-4">
      <div className="flex h-full w-full flex-col justify-between space-y-4 px-6 py-2">
        <p className="mx-auto text-center text-lg font-semibold text-ska-secondary">
          Upload
        </p>
        <div className="flex flex-col justify-between space-y-2 text-xs">
          <div className="form_group">
            <p className="form_group_entry">File</p>
            <TextField
              placeholder="Path"
              variant="outlined"
              size="small"
              className="grow"
              disabled
            />
            <Fab color="secondary" size="small" component="label">
              <input type="file" hidden />
              <FindInPage></FindInPage>
            </Fab>
          </div>
          <div className="flex w-full items-center justify-center">
            <Divider className="w-32 bg-ska-secondary"></Divider>
          </div>
          <div className="form_group">
            <p className="form_group_entry">Name</p>
            <TextField
              placeholder="Name"
              variant="outlined"
              size="small"
              className="grow"
            />
          </div>
          <div className="form_group">
            <p className="form_group_entry">Version</p>
            <TextField
              placeholder="Version"
              variant="outlined"
              size="small"
              className="grow"
            />
          </div>
          <Divider className="pt-2"></Divider>
          <p className="pb-2 text-sm font-bold">Settings</p>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label={<span className="text-xs">Public</span>}
          ></FormControlLabel>
        </div>
        <div className="flex justify-between">
          <Button variant="outlined" onClick={() => closeCallback()}>
            Cancel
          </Button>
          <Button variant="contained">Upload</Button>
        </div>
      </div>
    </div>
  );
}
