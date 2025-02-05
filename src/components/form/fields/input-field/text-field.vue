<template>
    <label class="text-field input-field" :class="$attrs.class">

        <debounceable-input :delay="typingDelay" @updated="debounced">
            <template #default="{ debounce }">

                <validatable-input :validations="validationMethods" @created="initialized" @updated="debounce">
                    <template #default="{ validate, invalid, showing, showValidity }">

                        <header v-if="$slots.label" class="label">
                            <slot name="label" />
                        </header>

                        <main class="input" :class="{ focused, invalid: invalid && showing }">
                            <prepend-append>
                                <template #prepend>
                                    <slot name="prepend" />
                                </template>

                                <user-input
                                    v-bind="filter($attrs, ['class'])"
                                    :name="name"
                                    :value="value"
                                    :allowed-characters="allowedCharacters"
                                    @focused="focused = true"
                                    @blurred="focused = false; showValidity();"
                                    @updated="validate"
                                    @created="validate"
                                />

                                <template #append>
                                    <slot name="append" />
                                </template>
                            </prepend-append>
                        </main>

                        <footer v-if="$slots.information && !(invalid && showing)" class="information">
                            <slot name="information" />
                        </footer>
                    </template>

                    <template v-for="validation of validationMethods" #[validation.name]>
                        <slot :name="validation.name" />
                    </template>
                </validatable-input>

            </template>
        </debounceable-input>

    </label>
</template>

<script lang="ts" setup>
import PrependAppend from '@/components/form/fields/additions/layout/prepend-append.vue';
import DebounceableInput from '@/components/form/fields/base/debounceable-input.vue';
import UserInput from '@/components/form/fields/base/user-input.vue';
import ValidatableInput from '@/components/form/fields/base/validatable-input.vue';
import { OptionalProps, RequiredProps } from '@/components/props.types';
import { UpdateEmitType, ValidatedFieldData, ValidationMethod } from '@/composables/types';
import { predefinedValidations } from '@/composables/validate-user-input';
import { filter } from '@/util/attrs';
import { ref } from 'vue';

const emit = defineEmits<{ (event: UpdateEmitType, data: ValidatedFieldData): void; }>();

const props = defineProps({
    name: RequiredProps.string,
    value: OptionalProps.string,
    typingDelay: OptionalProps.number, // TODO rename to something better
    allowedCharacters: OptionalProps.string,
    required: OptionalProps.booleanFalse,
    min: OptionalProps.number,
    max: OptionalProps.number,
    validations: OptionalProps.validations
});

const focused = ref(false);

const validationMethods: ValidationMethod[] = [
    { ...predefinedValidations['required'], parameters: [ props.required ] },
    { ...predefinedValidations['min-length'], parameters: [ props.min ] },
    { ...predefinedValidations['max-length'], parameters: [ props.max ] },
    ...props.validations
];

const initialized = (data: ValidatedFieldData): void => {
    emit('created', data);
};

const debounced = (data: ValidatedFieldData): void => {
    emit('updated', data);
};
</script>

<script lang="ts">
export default {
    inheritAttrs: false
};
</script>

<style lang="scss" scoped>
@use "../input-field";
</style>
