import React, { useEffect, useState } from "react"
import { Flex } from "rebass"
import BreadCrumb from "../../components/breadcrumb"
import Select from "../../components/molecules/select"
import BodyCard from "../../components/organisms/body-card"
import TwoSplitPane from "../../components/templates/two-split-pane"
import useMedusa from "../../hooks/use-medusa"
import { currencies } from "../../utils/currencies"
import { getErrorMessage } from "../../utils/error-messages"

const AccountDetails = () => {
  const [storeCurrencies, setStoreCurrencies] = useState([])
  const [allCurrencies, setAllCurrencies] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState({
    value: "",
    label: "",
  })

  const { store, isLoading, update, toaster } = useMedusa("store")

  const setCurrenciesOnLoad = () => {
    const defaultCurr = {
      label: store.default_currency_code.toUpperCase(),
      value: store.default_currency_code.toUpperCase(),
    }

    const storeCurrs = store.currencies.map(c => ({
      value: c.code.toUpperCase(),
      label: c.code.toUpperCase(),
    }))

    const allCurrs = Object.keys(currencies).map(currency => ({
      label: currency,
      value: currency,
    }))

    setSelectedCurrency(defaultCurr)
    setStoreCurrencies(storeCurrs)
    setAllCurrencies(allCurrs)
  }

  useEffect(() => {
    if (isLoading || !store) {
      return
    }

    setCurrenciesOnLoad()
  }, [store, isLoading])

  const handleChange = currencies => {
    setStoreCurrencies(currencies)
  }

  const onSubmit = e => {
    e.preventDefault()
    try {
      update({
        default_currency_code: selectedCurrency.value,
        currencies: storeCurrencies.map(c => c.value),
      })
      toaster("Successfully updated currencies", "success")
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
  }

  const currencyEvents = [
    {
      label: "Save",
      onClick: () => console.log("hello"),
    },
    {
      label: "Cancel changes",
      onClick: () => console.log("hello"),
    },
  ]

  return (
    <Flex as="form" flexDirection={"column"} onSubmit={e => onSubmit(e)}>
      <BreadCrumb
        previousRoute="/a/settings"
        previousBreadCrumb="Settings"
        currentPage="Currencies"
      />
      <TwoSplitPane>
        <BodyCard
          title="Currencies"
          subtitle="Manage the currencies that you will operate in"
          actionables={[{}]}
          events={currencyEvents}
        >
          <Flex width={1} flexDirection="column">
            <Select
              label="Default store currency"
              options={storeCurrencies} // You are only allow to choose default currency from store currencies
              value={[selectedCurrency]}
              isMultiSelect={false}
              enableSearch={true}
              onChange={e => setSelectedCurrency(e[0])}
            />
            <Select
              label="Store currencies"
              options={allCurrencies}
              value={storeCurrencies}
              isMultiSelect={true}
              enableSearch={true}
              onChange={handleChange}
            />
          </Flex>
        </BodyCard>
      </TwoSplitPane>
    </Flex>
  )
}

export default AccountDetails
