import { createSignal, onMount } from "solid-js";
import FormModal from "../misc/FormModal";
import AnimalCard from "./AnimalCard";
import { ANIAMLS } from "../../config";
import { userInfo } from "../store/userStore";
import { addAnimal } from "../../firebase/firestore";
import { showToast } from "../store/toastStore";

const AnimalCatalogue = () => {
  const [selected, setSelected] = createSignal(ANIAMLS[0].animal);
  const [name, setName] = createSignal("");
  const getTitle = () => {
    let title = "";
    if (!userInfo.animals) return title;

    userInfo.animals.length === 0
      ? (title = "Choose your first pet animal!")
      : (title = "Choose an animal to join you!");

    return title;
  };

  const handleAddAnimal = async (modal: HTMLDialogElement) => {
    try {
      await addAnimal(userInfo.id, {
        name: name(),
        type: selected(),
      });
      showToast(`${name()} now lives in your island!`);
    } catch (error) {
      showToast(`An error occured!`, 3000, "error");
      return error as string;
    }

    modal.close();
  };

  return (
    <FormModal
      id="animal-catalogue-modal"
      title={getTitle()}
      buttonText="Confirm"
      class={"max-w-xl"}
      onSubmit={handleAddAnimal}>
      <div class="grid grid-cols-3 gap-2 place-items-center mx-auto">
        {ANIAMLS.map(({ animal, requiredLvl, image }) => (
          <AnimalCard
            name={animal}
            image={image}
            requiredLvl={requiredLvl}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
      </div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend">
          How will your {selected()} be named?
        </legend>
        <input
          type="text"
          value={name()}
          required
          onInput={(e) => setName(e.currentTarget.value)}
          class="input input-neutral validator"
          placeholder="Megatron"
        />
        <div class="validator-hint hidden">Please provide a name.</div>
      </fieldset>
    </FormModal>
  );
};

export default AnimalCatalogue;
