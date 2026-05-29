import { useTheme } from "../../theme/useTheme";
import { Text, View } from "react-native";

export const CeroItems = ({ titulo, subtitulo, Icon }) => {
    const { colors } = useTheme();

    return (
        <View
            className={"p-6 rounded-2xl items-center"}
        >
            {/* Icono opcional */}
            {Icon && <Icon size={40} color={colors.textSecondary} className="mb-4" />}

            <Text
                className={"text-lg font-semibold mb-2 text-center"}
                style={{
                    color: colors.textSecondary,
                }}
            >
                {titulo}
            </Text>

            {subtitulo && <Text
                className={`text-sm text-center`}
                style={{
                    color: colors.textSecondary,
                }}
            >
                {subtitulo}
            </Text>}

        </View>
    );
};
