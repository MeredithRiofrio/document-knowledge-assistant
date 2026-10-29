import PropTypes from "prop-types";
import { useFormContext, useController } from "react-hook-form";

import MDButton from "shared/ui/MDButton";
import MDInput from "shared/ui/MDInput";
import MDBox from "shared/ui/MDBox";
import HelperText from "shared/ui/HelperText";

function ChunkEditor({ name, snapshotValue, onSave, onCancel }) {
  const { control, trigger, clearErrors } = useFormContext();
  const {
    field,
    fieldState: { error, isDirty },
  } = useController({ name, control });

  const value = (field.value ?? "").toString();
  const isSameAsSnapshot = value.trim() === (snapshotValue ?? "").toString().trim();

  const handleSave = async () => {
    const ok = await trigger(name); // valida con el zodResolver
    if (!ok) return;
    clearErrors(name);
    onSave();
  };

  return (
    <>
      <MDInput
        multiline
        rows={5}
        fullWidth
        value={value}
        onChange={field.onChange}
        onBlur={field.onBlur}
        error={!!error}
      />

      <HelperText error={error} charCount={value.length} max={4000} />

      <MDBox display="flex" alignItems="center" justifyContent="flex-end" mt={2}>
        <MDBox mr={1}>
          <MDButton size="small" color="dark" onClick={onCancel} variant="text">
            Cancelar
          </MDButton>
        </MDBox>
        <MDButton
          size="small"
          color="info"
          onClick={handleSave}
          disabled={!!error || isSameAsSnapshot || !isDirty}
        >
          Guardar
        </MDButton>
      </MDBox>
    </>
  );
}

ChunkEditor.propTypes = {
  name: PropTypes.string.isRequired,
  snapshotValue: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ChunkEditor;
