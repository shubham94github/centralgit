import React, { memo, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { H1, P12, P14, P16 } from "@components/_shared/text";
import {
  description,
  placeholderDescription,
  missionIcon,
  implementationTimeOptions,
  placeholderImplementationTime,
  areasGuidelineText,
} from "@components/Mission/constants";
import GridContainer from "@components/layouts/GridContainer";
import { schema } from "./schma";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { array, arrayOf, bool, func } from "prop-types";
import { useHistory } from "react-router-dom";
import TextInput from "@components/_shared/form/TextInput";
import TextArea from "@components/_shared/form/TextArea";
import Select from "@components/_shared/form/Select";
import PrimaryButton from "@components/_shared/buttons/PrimaryButton";
import AppModal from "@components/Common/AppModal";
import FormWithAccordion from "@components/Auth/GettingStarted/FormWithAccordion";
import ChosenFieldLabels from "@components/_shared/ChosenFieldLabels";
import { onSelectChange } from "@utils/onSelectChange";
import {
  getStartupsOptions,
  getCountries,
  getCategories,
  sendMission,
} from "@ducks/common/actions";
import { handleCreateSelectOption } from "@utils/hooks/handleCreateSelectOption";
import { isEmpty } from "@utils/js-helpers";
import { countryType } from "@constants/types";
import enums from "@constants/enums";
import { prepareSelectStyles } from "@components/Mission/utils";

import "./Mission.scss";

const Mission = ({
  getStartupsOptions,
  startupsOptions,
  getCountries,
  getCategories,
  sendMission,
  countries,
  categories,
  isLoading,
  handleClose,
}) => {
  const history = useHistory();
  const [isAreasOfInterest, setIsAreasOfInterest] = useState(false);
  const [selectedAreasOfInterest, setSelectedAreasOfInterest] = useState([]);

  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    setError,
    clearErrors,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    mode: enums.validationMode.all,
    reValidateMode: enums.reValidationMode.onChange,
    defaultValues: schema.default(),
  });

  useEffect(() => {
    if (isEmpty(startupsOptions)) getStartupsOptions();
    if (isEmpty(countries)) getCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAreasOfInterestModal = () =>
    setIsAreasOfInterest((prevState) => !prevState);

  const handleSelectAreasOfInterestItems = ({ checkedValues }) => {
    setSelectedAreasOfInterest(checkedValues);
    toggleAreasOfInterestModal();
  };

  const handleRemoveAreasOfInterestItem = (id) =>
    setSelectedAreasOfInterest((prevState) =>
      prevState.filter((area) => area.id !== id)
    );

  //   const redirectToPreviousPage = () => history.goBack();

  const onSubmit = (values) => {
    sendMission({
      ...values,
      budget: !!values.budget ? +values.budget : null,
      operationLocationIds: !!values.operationLocationIds.length
        ? values.operationLocationIds.map(({ id }) => id)
        : null,
      excludeCompaniesIds: !!values.excludeCompaniesIds.length
        ? values.excludeCompaniesIds.map(({ value }) => value)
        : null,
      implementationTime: values.implementationTime.value,
      areaOfInterestsIds: !!selectedAreasOfInterest.length
        ? selectedAreasOfInterest.map(({ id }) => id)
        : null,
    });
    handleClose();
  };

  const trimValues = (fieldName) => (value) =>
    setValue(fieldName, value.trim(), { shouldValidate: true });

  const selectStyles = useMemo(() => prepareSelectStyles(), []);

  return (
    <div className="mission-wrapper">
      <div className="mission-container">
        <div className="title mb-40">
          <span>{missionIcon}</span>
          <H1 bold className="text-darkblue">
            What's your mission?
          </H1>
        </div>
        <div className="description mb-40">
          <p>{description}</p>
        </div>
        <GridContainer gap="10px 30px" customClassName="mb-40">
          <P16 bold>Search Title</P16>
          <P14> Add a Title</P14>
          <TextInput
            type="text"
            name="searchTitle"
            placeholder="Title for the Search"
            register={register}
            isLightTheme
            isError={!!errors.searchTitle}
            control={control}
            onBlur={trimValues("searchTitle")}
            isWithoutTopPlaceholder
          />
          {!!errors.searchTitle && (
            <P12 className="warning-text">{errors.searchTitle.message}</P12>
          )}
        </GridContainer>
        <GridContainer gap="10px 30px" customClassName="mb-40">
          <P16 bold>Description</P16>
          <P14>Add as much information to help refine the mission</P14>
          <TextArea
            classNames="description-mission"
            id="description"
            isError={!!errors.description}
            name="description"
            register={register}
            placeholder={placeholderDescription}
            control={control}
            onBlur={trimValues("description")}
          />
          {!!errors.description && (
            <P12 className="warning-text">{errors.description.message}</P12>
          )}
        </GridContainer>
        <GridContainer
          gap="20px 30px"
          columns={2}
          template="390px auto"
          customClassName="align-items mb-20"
        >
          <GridContainer gap="10px 30px">
            <P16 bold>Implementation Timeline</P16>
            <P14>What is your approx implementation timeline?</P14>
            <Select
              name="implementationTime"
              control={control}
              register={register}
              options={implementationTimeOptions}
              placeholder={placeholderImplementationTime}
              onChange={onSelectChange({
                fieldName: "implementationTime",
                setValue,
                setError,
                clearErrors,
              })}
              value={watch("implementationTime")}
            />
            {!!errors.implementationTime && (
              <P12 className="warning-text">
                {errors.implementationTime.message}
              </P12>
            )}
          </GridContainer>
          <GridContainer gap="10px 30px">
            <P16 bold>Budget (USD)</P16>
            <P14>What is your approx budget</P14>
            <TextInput
              id="budget"
              isError={!!errors.budget}
              name="budget"
              placeholder="Currency (USD)"
              register={register}
              type="text"
              value={watch("budget")}
              isLightTheme
              setValue={setValue}
              onBlur={trimValues("budget")}
            />
          </GridContainer>
        </GridContainer>
        <GridContainer gap="10px 30px" customClassName="mb-20">
          <P16 bold>Operating Location(s)</P16>
          <P14>Where do this companies need to be operating</P14>
          <Select
            id="operationLocationIds"
            name="operationLocationIds"
            options={countries}
            isError={!!errors?.relatedTags}
            errorMessage={errors?.relatedTags?.message}
            register={register}
            placeholder="Select Operating Location(s)"
            isMulti={true}
            isClearable={true}
            isCreatable={true}
            control={control}
            onChange={onSelectChange({
              fieldName: "operationLocationIds",
              setValue,
              clearErrors,
              setError,
            })}
            handleCreateOpt={handleCreateSelectOption({
              fieldName: "operationLocationIds ",
              setValue,
              getValues,
              setError,
              clearErrors,
            })}
            disabled={isLoading}
            menuPlacement="top"
            isFilterForStart
          />
        </GridContainer>
        <GridContainer gap="10px 30px" customClassName="mb-20">
          <P16 bold>Exclude Startups</P16>
          <P14>List out any Startups that you want excluded</P14>
          <Select
            id="excludeCompaniesIds"
            name="excludeCompaniesIds"
            options={startupsOptions}
            isError={!!errors?.relatedTags}
            errorMessage={errors?.relatedTags?.message}
            register={register}
            placeholder="Exclude Startups"
            isMulti={true}
            isClearable={true}
            isCreatable={true}
            control={control}
            onChange={onSelectChange({
              fieldName: "excludeCompaniesIds",
              setValue,
              clearErrors,
              setError,
            })}
            handleCreateOpt={handleCreateSelectOption({
              fieldName: "excludeCompaniesIds",
              setValue,
              getValues,
              setError,
              clearErrors,
            })}
            menuPlacement="top"
            customStyles={selectStyles}
          />
        </GridContainer>
        <GridContainer gap="10px 30px" customClassName="mb-40">
          <P16 bold>Areas of Interest</P16>
          <P14>
            <span className="blue-link" onClick={toggleAreasOfInterestModal}>
              Select
            </span>
            &nbsp; the Categories that you would like use
          </P14>
          <ChosenFieldLabels
            items={selectedAreasOfInterest}
            removeItem={handleRemoveAreasOfInterestItem}
          />
        </GridContainer>
        <GridContainer
          columns={2}
          template="270px 270px"
          customClassName="buttons"
        >
          <PrimaryButton onClick={handleClose} text="Cancel" isOutline />
          <PrimaryButton
            onClick={handleSubmit(onSubmit)}
            text="Submit"
            disabled={!isEmpty(errors)}
          />
        </GridContainer>
      </div>
      {isAreasOfInterest && (
        <AppModal
          component={FormWithAccordion}
          className="sector-of-competence-mission"
          onClose={toggleAreasOfInterestModal}
          isScrollable
          title="Areas of interest"
          width="975px"
          outerProps={{
            isAdminPanel: false,
            isMission: true,
            isForModal: true,
            selectedFullValues: selectedAreasOfInterest,
            submitTitle: "Save",
            isLoading,
            getCategories,
            sendChosenItems: handleSelectAreasOfInterestItems,
            itemsName: "sectors",
            categories,
            step: 3,
            stepCount: 5,
            onClose: toggleAreasOfInterestModal,
            guidelineText: areasGuidelineText,
            isCancelButton: true,
          }}
        />
      )}
    </div>
  );
};

Mission.propTypes = {
  getStartupsOptions: func.isRequired,
  getCountries: func.isRequired,
  getCategories: func.isRequired,
  sendMission: func.isRequired,
  startupsOptions: array.isRequired,
  countries: arrayOf(countryType),
  categories: array,
  isLoading: bool,
};

export default connect(
  ({ common: { startupsOptions, countries, isLoading, categories } }) => {
    return {
      startupsOptions,
      countries,
      isLoading,
      categories,
    };
  },
  {
    getStartupsOptions,
    getCountries,
    getCategories,
    sendMission,
  }
)(memo(Mission));
