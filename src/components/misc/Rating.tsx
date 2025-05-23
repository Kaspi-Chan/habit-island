import { Accessor, Index, Setter } from "solid-js";
import { motivation } from "../../types";

interface RatingProps {
  motivation: Accessor<motivation>;
  setMotivation: Setter<motivation>;
}

const Rating = (props: RatingProps) => {
  const ratingLength = new Array(5);
  return (
    <div class="rating gap-1">
      <Index each={ratingLength}>
        {(item, index) => (
          <input
            type="radio"
            name="rating"
            class="mask mask-heart bg-primary"
            aria-label={`${index} star`}
            checked={props.motivation() === index + 1}
            onInput={() => props.setMotivation((index + 1) as motivation)}
          />
        )}
      </Index>
    </div>
  );
};

export default Rating;
